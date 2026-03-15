/**
 * Application-related constants.
 * Centralised here to avoid magic strings scattered across layers.
 */
const APPLICATION_STATUSES = ['Pending', 'Viewed', 'Interview', 'Accepted', 'Rejected'];

const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10
};

module.exports = { APPLICATION_STATUSES, PAGINATION_DEFAULTS };
