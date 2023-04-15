// UTC Timezone is used for all cron expressions
export const EVERY_DAY_AT_5AM = "0 05 * * *" as const;
export const EVERY_DAY_AT_5PM = "0 17 * * *" as const;
export const EVERY_DAY_AT_3PM = "0 15 * * *" as const;
export const EVERY_DAY_AT_4_15PM = "15 16 * * *" as const;
export const EVERY_DAY_AT_4_45PM = "45 16 * * *" as const;
export const EVERY_DAY_AT_MIDNIGHT = "0 0 * * *" as const;
export const EVERY_SUNDAY_AT_MIDNIGHT = "0 0 * * 0" as const;
export const EVERY_MONDAY_AT_MIDNIGHT = "0 0 * * 1" as const;
export const EVERY_FRIDAY_AT_NOON = "0 12 * * 5" as const;
export const EVERY_FRIDAY_AT_3PM = "0 15 * * 5" as const;
export const EVERY_FRIDAY_AT_4_15PM = "15 16 * * 5" as const;
export const EVERY_FRIDAY_AT_4_45PM = "45 16 * * 5" as const;
export const EVERY_SATURDAY_AT_2AM = "0 2 * * 6" as const;
