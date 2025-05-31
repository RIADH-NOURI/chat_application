

export const getLink = (part: string) => {
    const isLink =  /^https?:\/\/[^\s]+$/.test(part)
    return isLink
}