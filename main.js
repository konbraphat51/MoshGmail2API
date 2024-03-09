//GASスクリプト

//メール取り出し
const now = Math.floor(new Date().getTime() / 1000)
const start = now - 60 * 60 * 24 // 24時間前から
const threads = GmailApp.search(`after:${start}`)
