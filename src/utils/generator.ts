export class Generator {
  static randomText(): string {
    const numRg = Math.random() * 99999
    const randomNumber = Math.floor(numRg)
    const timeString = new Date().getTime().toString()
    const concatString = timeString + randomNumber.toString()
    return concatString.slice(0, 10)
  }
}
