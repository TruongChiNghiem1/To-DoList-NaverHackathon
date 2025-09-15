import naverLogo from '../naver-logo.svg';
import hackathonGraphic from '../hackathon-graphic.svg';

export const ICONS = {
    APP_LOGO: '/icon/list.png',
    NAVER_LOGO: naverLogo,
    HACKATHON: hackathonGraphic,
    LIST: '/icon/to-do-list.png',
    CALENDAR: '/icon/schedule.png',
    CHART: '/icon/analysis.png',
    PLUS: '/icon/plus.png',
    BOOK: '/icon/reading.png',
    WORK: '/icon/working.png',
    USER: '/icon/user.png',
    PROJECT: '/icon/project.png',
    EXAM: '/icon/exam.png',
    CLIPBOARD: '/icon/clipboard.png',
    EDIT: '/icon/compose.png',
    DELETE: '/icon/delete.png',
    CLOCK: '/icon/chronometer.png',
    LIGHTBULB: '/icon/lightbulb.png',
    FLASH: '/icon/flash.png',
    TOTAL: '/icon/sigma.png',
    COMPLETE: '/icon/checked.png',
    OVERDUE: '/icon/overdue.png',
    AVERAGE: '/icon/speed.png',
} as const;

export type IconType = keyof typeof ICONS;
