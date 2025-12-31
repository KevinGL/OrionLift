

export const getLocalDateISO = (): string =>
{
    const now = new Date();
    const localISO = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 19);

    return localISO;
}