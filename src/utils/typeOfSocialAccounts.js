import instagram from "../images/icons/instagram.svg";
import tiktok from "../images/icons/socialMedias/tiktok.png";
import facebook from "../images/icons/socialMedias/facebook.png";
import youtube from "../images/icons/socialMedias/youtube.png";
import spotify from "../images/icons/socialMedias/spotify.png";
import soundcloud from "../images/icons/socialMedias/soundcloud.png";
import press from "../images/icons/socialMedias/tablet.png";

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

export const getSocialMedia = (socialMedia) => {
    switch (socialMedia) {
        case "instagram":
            return "Instagram";
        case "tiktok":
            return "TikTok";
        case "facebook":
            return "Facebook";
        case "youtube":
            return "YouTube";
        case "spotify":
            return "Spotify";
        case "soundcloud":
            return "Soundcloud";
        case "press":
            return "Press";
        default:
            return "Instagram";
    }
}

export const getSocialMediaIcon = (socialMedia) => {
    switch (socialMedia) {
        case "instagram":
            return instagram;
        case "tiktok":
            return tiktok;
        case "facebook":
            return facebook;
        case "youtube":
            return youtube;
        case "spotify":
            return spotify;
        case "soundcloud":
            return soundcloud;
        case "press":
            return press;
        default:
            return instagram;
    }
}