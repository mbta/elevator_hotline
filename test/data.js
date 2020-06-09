const north_station = {
  attributes: {
    name: "North Station",
  },
  id: "place-north",
  links: {
    self: "/stops/place-north",
  },
  relationships: {
    child_stops: {},
    facilities: {
      links: {
        related: "/facilities/?filter[stop]=place-north",
      },
    },
    parent_station: {
      data: null,
    },
    recommended_transfers: {},
    zone: {
      data: {
        id: "CR-zone-1A",
        type: "zone",
      },
    },
  },
  type: "stop",
};

const symphony = {
  attributes: {
    name: "Symphony",
  },
  id: "place-symcl",
  links: {
    self: "/stops/place-symcl",
  },
  relationships: {
    child_stops: {},
    facilities: {
      links: {
        related: "/facilities/?filter[stop]=place-symcl",
      },
    },
    parent_station: {
      data: null,
    },
    recommended_transfers: {},
    zone: {
      data: null,
    },
  },
  type: "stop",
};

exports.commuter = function () {
  return process.env.LINE_COMMUTER.split(",")
    .map((item) => item.trim())
    .join(",");
};
exports.silver = function () {
  return process.env.LINE_SILVER.split(",")
    .map((item) => item.trim())
    .join(",");
};
exports.blue = function () {
  return process.env.LINE_BLUE.split(",")
    .map((item) => item.trim())
    .join(",");
};
exports.orange = function () {
  return process.env.LINE_ORANGE.split(",")
    .map((item) => item.trim())
    .join(",");
};
exports.red = function () {
  return process.env.LINE_RED.split(",")
    .map((item) => item.trim())
    .join(",");
};

exports.green = function () {
  return process.env.LINE_GREEN.split(",")
    .map((item) => item.trim())
    .join(",");
};

exports.no_alerts = function () {
  return {
    data: [],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.one_alert = function () {
  return {
    data: [
      {
        attributes: {
          active_period: [
            {
              end: null,
              start: "2019-11-12T04:30:00-05:00",
            },
          ],
          banner: null,
          cause: "UNKNOWN_CAUSE",
          created_at: "2019-10-21T16:59:16-04:00",
          description: "example description",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "place-north",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header.",
          timeframe: "ongoing",
          updated_at: "2019-11-29T09:59:07-05:00",
          url: null,
        },
        id: "338973",
        links: {
          self: "/alerts/338973",
        },
        type: "alert",
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.not_alert = function () {
  return {
    data: [
      {
        attributes: {
          active_period: [
            {
              end: null,
              start: "2019-11-12T04:30:00-05:00",
            },
          ],
          banner: null,
          cause: "UNKNOWN_CAUSE",
          created_at: "2019-10-21T16:59:16-04:00",
          description: "example description",
          effect: "OTHER_CLOSURE",
          header: "Example header.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "place-north",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header.",
          timeframe: "ongoing",
          updated_at: "2019-11-29T09:59:07-05:00",
          url: null,
        },
        id: "338973",
        links: {
          self: "/alerts/338973",
        },
        type: "alert",
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.unmatched_alert = function () {
  return {
    data: [
      {
        attributes: {
          active_period: [
            {
              end: null,
              start: "2019-11-12T04:30:00-05:00",
            },
          ],
          banner: null,
          cause: "UNKNOWN_CAUSE",
          created_at: "2019-10-21T16:59:16-04:00",
          description: "example description",
          effect: "ESCALATOR_CLOSURE",
          header: "Example header.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "852",
              stop: "place-south",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header.",
          timeframe: "ongoing",
          updated_at: "2019-11-29T09:59:07-05:00",
          url: null,
        },
        id: "338974",
        links: {
          self: "/alerts/338973",
        },
        type: "alert",
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.many_alerts = function () {
  return {
    data: [
      {
        attributes: {
          active_period: [
            {
              end: null,
              start: "2019-11-12T04:30:00-05:00",
            },
          ],
          banner: null,
          cause: "UNKNOWN_CAUSE",
          created_at: "2019-10-21T16:59:16-04:00",
          description: "example description",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "place-north",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header.",
          timeframe: "ongoing",
          updated_at: "2019-11-29T09:59:07-05:00",
          url: null,
        },
        id: "338973",
        links: {
          self: "/alerts/338973",
        },
        type: "alert",
      },
      {
        attributes: {
          active_period: [
            {
              end: null,
              start: "2019-11-12T04:30:00-05:00",
            },
          ],
          banner: null,
          cause: "UNKNOWN_CAUSE",
          created_at: "2019-10-21T16:59:16-04:00",
          description: "example description2",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header2.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "place-symcl",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header2.",
          timeframe: "ongoing",
          updated_at: "2019-12-29T09:59:07-05:00",
          url: null,
        },
        id: "338973",
        links: {
          self: "/alerts/338973",
        },
        type: "alert",
      },
      {
        attributes: {
          active_period: [
            {
              end: null,
              start: "2019-11-12T04:30:00-05:00",
            },
          ],
          banner: null,
          cause: "UNKNOWN_CAUSE",
          created_at: "2019-10-21T16:59:16-04:00",
          description: "example description3",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header3.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "place-north",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header3.",
          timeframe: "ongoing",
          updated_at: "2019-13-29T09:59:07-05:00",
          url: null,
        },
        id: "338973",
        links: {
          self: "/alerts/338973",
        },
        type: "alert",
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.no_route = function () {
  return {
    data: [],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.green_route = function () {
  return {
    data: [north_station, symphony],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.orange_route = function () {
  return {
    data: [north_station],
    jsonapi: {
      version: "1.0",
    },
  };
};
