/**
 * Application-related constants.
 * Centralised here to avoid magic strings scattered across layers.
 */
const APPLICATION_STATUSES = ['Pending', 'Viewed', 'Interview', 'Accepted', 'Rejected'];

const APPLICATION_STATUS_VALUES = {
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected'
};

const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10
};

module.exports = { APPLICATION_STATUSES, APPLICATION_STATUS_VALUES, PAGINATION_DEFAULTS };
