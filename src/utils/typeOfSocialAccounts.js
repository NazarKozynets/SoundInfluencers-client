export const typeOfAccounts = [
    {
        publicLink: "Instagram",
        db: "instagram",
    },
    {
        publicLink: "Facebook",
        db: "facebook",
    },
    {
        publicLink: "TikTok",
        db: "tiktok",
    },
    {
        publicLink: "Spotify",
        db: "spotify",
    },
    {
        publicLink: "Soundcloud",
        db: "soundcloud",
    },
    {
        publicLink: "YouTube",
        db: "youtube",
    },
    {
        publicLink: "Press",
        db: "press",
    },
];

export const getAccountType = (db) => {
    return typeOfAccounts.find((account) => account.db === db).publicLink;
}