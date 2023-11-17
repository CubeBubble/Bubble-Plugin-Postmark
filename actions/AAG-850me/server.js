async function(properties, context) {
  //Attachments

  if (properties.attachmentnames) {
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

  const url = "https://api.postmarkapp.com/email";

  var requestHeaders = new Headers();
  requestHeaders.append("Accept", "application/json");
  requestHeaders.append("Content-Type", "application/json");
  requestHeaders.append("X-Postmark-Server-Token", context.keys.ServerAPIKey);

  let requestBody = {
    From: properties.from,
    To: properties.to,
    Cc: properties.cc,
    Bcc: properties.bcc,
    Subject: properties.subject,
    Tag: properties.tag,
    TextBody: properties.textbody,
    HtmlBody: properties.htmlbody,
    ReplyTo: properties.replyto,
    Headers: headers,
    TrackOpens: properties.trackopens,
    TrackLinks: properties.tracklinks,
    Metadata: metadata,
    Attachments: attachments,
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