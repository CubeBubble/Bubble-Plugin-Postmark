async function(properties, context) {
  if (properties.attribute1list) {
    var objects = [];

    var objectsLength = properties.attribute1list.length();
    if (properties.attribute1list) {
      var attribute1list = properties.attribute1list.get(
        0,
        properties.attribute1list.length()
      );
    }
    if (properties.attribute2list) {
      var attribute2list = properties.attribute2list.get(
        0,
        properties.attribute2list.length()
      );
    }
    if (properties.attribute3list) {
      var attribute3list = properties.attribute3list.get(
        0,
        properties.attribute3list.length()
      );
    }

    for (i = 0; i < objectsLength; i++) {
      var object = new Object();
      if (properties.attribute1list) {
        object[properties.attribute1name] = attribute1list[i];
      }
      if (properties.attribute2list) {
        object[properties.attribute2name] = attribute2list[i];
      }
      if (properties.attribute3list) {
        object[properties.attribute3name] = attribute3list[i];
      }
      objects.push(object);
    }
  }

  var templatemodel = new Object();

  properties.templatemodel.forEach((e) => {
    templatemodel[e.key] = e.value;
    if (properties.objectname && properties.attribute1list) {
      templatemodel[properties.objectname] = objects;
    }
  });

  //Advanced template model feature
  let templateModelObject = null;

  try {
    templateModelObject = JSON.parse(properties.templateModelObject);
  } catch (e) {}

  if (templateModelObject) {
    templatemodel = { ...templatemodel, ...templateModelObject };
  }

  if (properties.attachmentnames) {
    //Attachments

    var attachments = [];

    var attachmentsLength = properties.attachmentnames.length();
    if (properties.attachmentnames) {
      var attachmentnames = properties.attachmentnames.get(
        0,
        properties.attachmentnames.length()
      );
      var attachmentcontents = properties.attachmentcontents.get(
        0,
        properties.attachmentcontents.length()
      );
      var attachmentcontenttypes = properties.attachmentcontenttypes.get(
        0,
        properties.attachmentcontenttypes.length()
      );
    }

    for (i = 0; i < attachmentsLength; i++) {
      var attachment = new Object();

      if (properties.attachmentnames) {
        attachment["Name"] = attachmentnames[i];
        attachment["Content"] = attachmentcontents[i];
        attachment["ContentType"] = attachmentcontenttypes[i];
      }

      attachments.push(attachment);
    }
  }

  //Headers

  var headers = [];

  properties.headers.forEach((e) => {
    var header = new Object();
    header["Name"] = e.key;
    header["Value"] = e.value;
    headers.push(header);
  });

  //Metadata

  var metadata = new Object();

  properties.metadata.forEach((e) => {
    metadata[e.key] = e.value;
  });

  //Request

  const url = "https://api.postmarkapp.com/email/withTemplate/";

  var requestHeaders = new Headers();
  requestHeaders.append("Accept", "application/json");
  requestHeaders.append("Content-Type", "application/json");
  requestHeaders.append("X-Postmark-Server-Token", context.keys.ServerAPIKey);

  let requestBody = {
    TemplateId: properties.templateid,
    TemplateAlias: properties.templatealias,
    TemplateModel: templatemodel,
    InlineCss: properties.inlinecss,
    From: properties.from,
    To: properties.to,
    Cc: properties.cc,
    Bcc: properties.bcc,
    Tag: properties.tag,
    ReplyTo: properties.replyto,
    Headers: headers,
    TrackOpens: properties.trackopens,
    TrackLinks: properties.tracklinks,
    Attachments: attachments,
    Metadata: metadata,
    MessageStream: properties.messagestream,
  };

  var options = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url, options);
    const body = await response.json();
    return {
      to: body.To,
      messageid: body.MessageID,
    };
  } catch (error) {
    throw error;
  }
}