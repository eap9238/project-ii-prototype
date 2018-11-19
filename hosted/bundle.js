"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoTitle").val() == '' || $("#domoBody").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  $(".domoForm").style.display = "none";

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

var showModal = function showModal(e) {
  e.preventDefault();

  $(".domoForm").style.display = "block";

  console.log("Yoop");
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  /*
  console.dir("Object Parent 1 Object:");
  console.dir($("#" + e.target.id));
  console.dir("Original: ");
  console.dir($("#deleteDomo"));
  
  console.dir("Action: ");
  console.dir($("#" + e.target.id).attr("action"));    
  console.dir("Action: ");
  console.dir($("#deleteDomo").attr("action"));
  */

  sendAjax('DELETE', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
    loadDomosFromServer($("token").val());
  });
};

var ModalForm = function ModalForm(props) {
  return React.createElement(
    "form",
    { id: "modalForm", onSubmit: showModal, name: "modalForm", className: "modalForm" },
    React.createElement("input", { className: "makeModalSubmit", type: "submit", value: "Make Modal" })
  );
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    "form",
    { id: "domoForm", onSubmit: handleDomo, name: "domoForm", action: "/maker", method: "POST", className: "domoForm" },
    React.createElement(
      "label",
      { htmlFor: "title" },
      "Title: "
    ),
    React.createElement("input", { id: "domoTitle", type: "text", name: "title", placeholder: "Note Title" }),
    React.createElement(
      "label",
      { htmlFor: "body" },
      "Contents: "
    ),
    React.createElement("input", { id: "domoBody", type: "textarea", name: "body", placeholder: "Note Contents" }),
    React.createElement(
      "label",
      { htmlFor: "colour" },
      "Colour: "
    ),
    React.createElement(
      "select",
      { id: "domoColour", name: "colour" },
      React.createElement(
        "option",
        { style: { backgroundColor: '#DF2935' }, value: "red" },
        "red"
      ),
      React.createElement(
        "option",
        { style: { backgroundColor: '#FFE74C' }, value: "yellow" },
        "yellow"
      ),
      React.createElement(
        "option",
        { selected: true, style: { backgroundColor: '#30BCED' }, value: "blue" },
        "blue"
      ),
      React.createElement(
        "option",
        { style: { backgroundColor: '#FFAE03' }, value: "orange" },
        "orange"
      ),
      React.createElement(
        "option",
        { style: { backgroundColor: '#35FF69' }, value: "green" },
        "green"
      )
    ),
    React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Domos yet"
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { key: domo._id, className: domo.colour },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
      React.createElement(
        "h3",
        { className: "domoTitle" },
        domo.title
      ),
      React.createElement(
        "div",
        { className: "domoBody" },
        domo.body
      ),
      React.createElement(
        "h4",
        null,
        "Date"
      ),
      React.createElement(
        "form",
        { id: domo._id,
          onSubmit: handleDelete,
          name: "deleteDomo",
          action: "/deleteDomo",
          method: "DELETE"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: domo._id }),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoDelete", type: "submit", value: "X" })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(ModalForm, { csrf: csrf }), document.querySelector("#modalManager"));

  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));

  loadDomosFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

// handleError()
var handleError = function handleError(msg) {
  $('#errorMessage').text(msg);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

// redirect()
var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

// sendAjax()
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      console.log(xhr.responseText);
      var msgObj = JSON.parse(xhr.responseText);
      handleError(msgObj.error);
    }
  });
};
