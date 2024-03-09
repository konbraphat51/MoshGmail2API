//GASスクリプト

//>>定数類
//Mosh側仕様変更に注意
const moshEmail = "hello@themosh.jp"
const registredTitle = "サービスへのお申し込みがありました"
//<<

//ログとなるスプレッドシート
const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ログ")
const logSheetLastRow = logSheet
	.getRange("A:A")
	.getValues()
	.filter(String).length
const logSheetData = logSheet.getRange(1, 1, logSheetLastRow, 2).getValues()

//メール取り出し
const now = Math.floor(new Date().getTime() / 1000)
const start = now - 60 * 60 * 2 // 2時間前から
const threads = GmailApp.search(`after:${start}`)

//Moshのサービス申し込みメールのみ抽出
var emails = []
threads.forEach((thread) => {
	thread.getMessages().forEach((message) => {
		const email = {
			body: message.getPlainBody(),
			date: message.getDate(),
			from: message.getFrom(),
			subject: message.getSubject(),
		}

		//送信元がMoshでないなら...
		if (email.from.indexOf(moshEmail) === -1) {
			//...スキップ
			return
		}

		//申し込みメールでないなら...
		if (email.subject.indexOf(registredTitle) === -1) {
			//...スキップ
			return
		}

		emails.push(email)
	})
})

//>>申し込みメール読み込み
//アンケートから対象の情報を取り出す関数
function GetAnswer(lines, query) {
	const line = lines.find((line) => line.indexOf(query) !== -1)
	if (!line) {
		throw new Error(`"${query}"が見つかりません`)
	}

	//最初の": "以降を取り出す
	let splited = line.split(": ")
	splited.splice(0, 1) //第1項削除
	return splited.join(": ") //残りを結合
}

var emailsContent = []
emails.forEach((email) => {
	//行区切り
	const lines = email.body.split("\n")

	const emailAddr = GetAnswer(lines, "登録メールアドレス")

	const emailContent = {
		emailAddr: emailAddr,
		date: email.date,
	}

	emailsContent.push(emailContent)
})
//<<

//スプレッドシート照会し重複回避
var emailsContentNew = []
emailsContent.forEach((emailContent) => {
	//ログシートに同一のデータがないか確認
	let isExist = false
	for (let cnt = 0; cnt < logSheetLastRow; cnt++) {
		if (
			logSheetData[cnt][0] === emailContent.emailAddr &&
			logSheetData[cnt][1] === emailContent.date
		) {
			//発見
			isExist = true
			break
		}
	}

	if (!isExist) {
		//新規
		emailsContentNew.push(emailContent)
	}
})
