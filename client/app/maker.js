const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoTitle").val() == '' || $("#domoBody").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

const handleDelete = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  sendAjax('DELETE', $("#deleteDomo").attr("action"), $("#deleteDomo").serialize(), function(){
    loadDomosFromServer($("token").val());
  });
};

const DomoForm = (props) => {
  return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        <label htmlFor="title">Title: </label>
        <input id="domoTitle" type="text" name="title" placeholder="Note Title"/>
        <label htmlFor="body">Contents: </label>
        <input id="domoBody" type="textarea" name="body" placeholder="Note Contents"/>
        <label htmlFor="colour">Colour: </label>
        <select id="domoColour" name="colour">
            <option selected style={{backgroundColor:'#DF2935'}} value="red">red</option>
            <option style={{backgroundColor:'#FFE74C'}} value="yellow">yellow</option>
            <option style={{backgroundColor:'#30BCED'}} value="blue">blue</option>
            <option style={{backgroundColor:'#FFAE03'}} value="orange">orange</option>
            <option style={{backgroundColor:'#35FF69'}} value="green">green</option>
        </select>
        <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
  );
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className={domo.colour}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
        <h3 className="domoTitle">{domo.title}</h3>
        <div className="domoBody">{domo.body}</div>
        <p>"Colour: " + {domo.colour}</p>
        <form id="deleteDomo"
              onSubmit={handleDelete}
              name="deleteDomo"
              action="/deleteDomo"
              method="DELETE"
        >
            <input type="hidden" name="_id" value={domo._id}/>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
            <input className="makeDomoDelete" type="submit" value="X"/>
        </form>
      </div>
    );
  });

  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = (csrf) => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} csrf={csrf}/>, document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} csrf={csrf}/>, document.querySelector("#domos")
  );

  loadDomosFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});