//GASスクリプト

//メール取り出し
const now = Math.floor(new Date().getTime() / 1000)
const start = now - 60 * 60 * 24 // 24時間前から
const threads = GmailApp.search(`after:${start}`)

//メールの内容を取り出し
var emails = []
threads.forEach((thread) => {
	thread.getMessages().forEach((message) => {
		const email = {
			body: message.getPlainBody(),
			date: message.getDate(),
			from: message.getFrom(),
			subject: message.getSubject(),
		}
		emails.push(email)
	})
})
