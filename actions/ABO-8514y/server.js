async function(properties, context) {
  const moment = require("moment");
  const ics = require("ics");
  const startTime = moment
    .utc(properties.starttime)
    .format("YYYY-M-D-H-m")
    .split("-");
  const endTime = moment
    .utc(properties.endtime)
    .format("YYYY-M-D-H-m")
    .split("-");
  const location = properties.location;
  const alarms = [];
  const organizerName = await properties.organizer.get(
    properties.organizername
  );
  const organizerEmail = await properties.organizer.get(
    properties.organizeremail
  );
  const attendeesLength = await properties.attendees.length();
  const attendeesObjects = await properties.attendees.get(0, attendeesLength);
  const attendees = await Promise.all(
    attendeesObjects.map(async (attendeeObject) => {
      return {
        name: await attendeeObject.get(properties.attendeename),
        email: await attendeeObject.get(properties.attendeeemail),
      };
    })
  );

  var uid =
    moment().unix().toString() +
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 8) +
    "@" +
    properties.domainname;

  const event = {
    start: startTime,
    startInputType: "utc",
    startOutputType: "utc",
    end: endTime,
    title: properties.title,
    description: properties.description,
    uid: uid,
    status: properties.status,
    busyStatus: properties.busyStatus,
    organizer: { name: organizerName, email: organizerEmail },
    attendees: [],
  };

  if (properties.location) {
    event.location = properties.address;
    event.geo = { lat: location.lat, lon: location.lng };
  }

  if (properties.calname) {
    event.calName = properties.calname;
  }

  if (properties.url) {
    event.url = properties.url;
  }

  attendees.forEach((attendee) => {
    event.attendees.push({
      name: attendee.name,
      email: attendee.email,
      rsvp: true,
      partstat: "ACCEPTED",
    });
  });

  try {
    const response = await ics.createEvent(event);
    let buffer = new Buffer(response.value);
    let base64data = buffer.toString("base64");
    return {
      data: [base64data],
      name: [properties.filename + ".ics"],
      type: ["text/calendar; charset=utf-8; method=REQUEST"],
      uid: uid,
    };
  } catch (error) {
    throw error;
  }
}