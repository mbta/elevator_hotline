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
              stop: "70104",
            },
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
          description: "example description",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "70104",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header.",
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
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.many_alerts_for_sort = function () {
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
          description: "example description new",
          effect: "ELEVATOR_CLOSURE",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "place-north",
            },
          ],
          lifecycle: "NEW",
          service_effect: "elevator unavailable new",
          severity: 1,
          short_header: "short header new.",
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
          description: "example description",
          effect: "ELEVATOR_CLOSURE",
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
          description: "example description",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "70104",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header.",
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
          created_at: "2019-10-21T17:59:16-04:00",
          description: "example description5",
          effect: "ELEVATOR_CLOSURE",
          header: "Example header5.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "70104",
            },
          ],
          lifecycle: "ONGOING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header5.",
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
          description: "example description2",
          effect: "ESCALATOR_CLOSURE",
          header: "Example header2.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "70105",
            },
          ],
          lifecycle: "ONGOING_UPCOMING",
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
          effect: "ACCESS_ISSUE",
          header: "Example header3.",
          informed_entity: [
            {
              activities: ["USING_WHEELCHAIR"],
              facility: "850",
              stop: "70105",
            },
          ],
          lifecycle: "ONGOING_UPCOMING",
          service_effect: "elevator unavailable",
          severity: 1,
          short_header: "short header3.",
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
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.no_station = () => {
  return {
    data: [],
    included: [],
    jsonapi: {
      version: "1.0",
    },
  };
};
exports.north_station = () => {
  return {
    data: [
      {
        attributes: {},
        id: "Orange",
        links: {
          self: "/routes/Orange",
        },
        relationships: {
          line: {
            data: {
              id: "line-Orange",
              type: "line",
            },
          },
          route_patterns: {},
          stop: {
            data: {
              id: "place-north",
              type: "stop",
            },
          },
        },
        type: "route",
      },
      {
        attributes: {},
        id: "Green-C",
        links: {
          self: "/routes/Green-C",
        },
        relationships: {
          line: {
            data: {
              id: "line-Green",
              type: "line",
            },
          },
          route_patterns: {},
          stop: {
            data: {
              id: "place-north",
              type: "stop",
            },
          },
        },
        type: "route",
      },
      {
        attributes: {},
        id: "Green-E",
        links: {
          self: "/routes/Green-E",
        },
        relationships: {
          line: {
            data: {
              id: "line-Green",
              type: "line",
            },
          },
          route_patterns: {},
          stop: {
            data: {
              id: "place-north",
              type: "stop",
            },
          },
        },
        type: "route",
      },
    ],
    included: [
      {
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
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.quincy_center = () => {
  return {
    data: [
      {
        attributes: {},
        id: "Red",
        links: {
          self: "/routes/Red",
        },
        relationships: {
          line: {
            data: {
              id: "line-Red",
              type: "line",
            },
          },
          route_patterns: {},
          stop: {
            data: {
              id: "70105",
              type: "stop",
            },
          },
        },
        type: "route",
      },
    ],
    included: [
      {
        attributes: {
          name: "Quincy Center",
        },
        id: "70105",
        links: {
          self: "/stops/70105",
        },
        relationships: {
          child_stops: {},
          facilities: {
            links: {
              related: "/facilities/?filter[stop]=70105",
            },
          },
          parent_station: {
            data: {
              id: "place-qamnl",
              type: "stop",
            },
          },
          recommended_transfers: {},
          zone: {
            data: {
              id: "RapidTransit",
              type: "zone",
            },
          },
        },
        type: "stop",
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};

exports.quincy_adams = () => {
  return {
    data: [
      {
        attributes: {},
        id: "Red",
        links: {
          self: "/routes/Red",
        },
        relationships: {
          line: {
            data: {
              id: "line-Red",
              type: "line",
            },
          },
          route_patterns: {},
          stop: {
            data: {
              id: "70104",
              type: "stop",
            },
          },
        },
        type: "route",
      },
    ],
    included: [
      {
        attributes: {
          name: "Quincy Adams",
        },
        id: "70104",
        links: {
          self: "/stops/70104",
        },
        relationships: {
          child_stops: {},
          facilities: {
            links: {
              related: "/facilities/?filter[stop]=70104",
            },
          },
          parent_station: {
            data: {
              id: "place-qamnl",
              type: "stop",
            },
          },
          recommended_transfers: {},
          zone: {
            data: {
              id: "RapidTransit",
              type: "zone",
            },
          },
        },
        type: "stop",
      },
    ],
    jsonapi: {
      version: "1.0",
    },
  };
};
