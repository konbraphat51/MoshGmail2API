//GASスクリプト

//>>定数類
//Mosh側仕様変更に注意
const moshEmail = "hello@themosh.jp"
const registredTitle = "サービスへのお申し込みがありました"
//<<

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
