const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoTitle").val() == '' || $("#domoBody").val() == '') {
    handleError("Please select options for all fields");
    return false;
  }

  document.getElementById("domoForm").style.display = "none";
    
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

const showModal = (e) => {
  //e.preventDefault();
    console.log("Yo");
  //document.getElementById("domoForm").style.display = "block";
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

const DomoForm = (props) => {
  document.getElementById("modal").onclick = function() {
      document.getElementById("domoForm").style.display = "block";
  };
    
  return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        <div className="DomoFormObject"> 
            <label htmlFor="title">Title: </label>
            <br/>
            <input id="domoTitle" type="text" name="title" placeholder="Note Title"/>
      
            <br/>
            <br/>
      
            <label htmlFor="body">Contents: </label>
            <br/>
            <input id="domoBody" type="textarea" name="body" cols="27" wrap="hard" placeholder="Note Contents"/>
      
            <br/>
            <br/>
      
            <label htmlFor="colour">Colour: </label>
            <br/>
            <select id="domoColour" name="colour">
                <option style={{backgroundColor:'#DF2935'}} value="red">red</option>
                <option style={{backgroundColor:'#FFE74C'}} value="yellow">yellow</option>
                <option selected style={{backgroundColor:'#30BCED'}} value="blue">blue</option>
                <option style={{backgroundColor:'#FFAE03'}} value="orange">orange</option>
                <option style={{backgroundColor:'#35FF69'}} value="green">green</option>
            </select>
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
      
            <br/>
            <br/>
      
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
            <input className="makeDomoSubmit" onClick={hideModal} type="button" value="Exit"/>
        </div>
    </form>
  );
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">
        <br/>
        <br/>
        <br/>
        </h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function(domo) {
    console.dir(domo);
    console.dir(domo.date);
      
    return (
      <div key={domo._id} className={domo.colour}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
        <h3 className="domoTitle">{domo.title}</h3>
        <div className="domoBody">{domo.body}</div>
        <h4 className="domoDate">Date: {domo.date.getDate()}</h4>
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
  /*
    ReactDOM.render(
    <ModalForm csrf={csrf} />, document.querySelector("#modalManager")
  );
  */
    
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