const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoTitle").val() == '' || $("#domoBody").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  document.getElementById("domoForm").style.display = "none";
    
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

const showModal = (e) => {
  e.preventDefault();
    
  document.getElementById("domoForm").style.display = "block";
};

const hideModal = (e) => {
  e.preventDefault();
    
  document.getElementById("domoForm").style.display = "none";
};

const handleDelete = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  sendAjax('DELETE', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function(){
    loadDomosFromServer($("token").val());
  });
};

const ModalForm = (props) => {
  return (
    <form id="modalForm" onSubmit={showModal} name="modalForm" className="modalForm">
        <input className="makeModalSubmit" type="submit" value="Make Modal"/>
    </form>
  );
};

const DomoForm = (props) => {
  return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        <div className="DomoFormObject"> 
            <label htmlFor="title">Title: </label>
            <input id="domoTitle" type="text" name="title" placeholder="Note Title"/>
      
            <br/>
      
            <label htmlFor="body">Contents: </label>
            <input id="domoBody" type="textarea" name="body" placeholder="Note Contents"/>
      
            <br/>
      
            <label htmlFor="colour">Colour: </label>
            <select id="domoColour" name="colour">
                <option style={{backgroundColor:'#DF2935'}} value="red">red</option>
                <option style={{backgroundColor:'#FFE74C'}} value="yellow">yellow</option>
                <option selected style={{backgroundColor:'#30BCED'}} value="blue">blue</option>
                <option style={{backgroundColor:'#FFAE03'}} value="orange">orange</option>
                <option style={{backgroundColor:'#35FF69'}} value="green">green</option>
            </select>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
      
            <br/>
      
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
      {/* <input className="makeDomoSubmit" onclick="hideModal" type="button" value="Exit"/> */}
        </div>
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
        <form id={domo._id}
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
    <ModalForm csrf={csrf} />, document.querySelector("#modalManager")
  );
    
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