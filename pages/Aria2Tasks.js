import { FOCUSABLE_SELECTOR } from "@testing-library/user-event/dist/utils";
import React,  { useEffect, useState } from "react";
//import { Helmet } from "react-helmet"

export const Task = (props) =>{
  const [etc, setETC] = useState('');
  const [jobPercent,setJobPercent]=useState(0);
  const [myIcon,setMyIcon]=useState("icon-ok");
  const task = props.item;
  const [formatedDLSpeed,setFormatedDLSpeed ]= useState(0);
  const [formatedTotalLen,setFormatedTotalLen ]= useState(0);
  const [formatedCompletedLen,setFormatedCompletedLen ]= useState(0);
  const type = props.type;

  // const taskprogress='';

  useEffect(()=>{
    let ignore = false;
    getTitle();    
    
    //setTaskContent(task);
    if (!ignore){
      //setIsLoaded(true);
      setJobPercent(calcProgress());
      setMyIcon ( stat_icon());

      setFormatedDLSpeed( format_size(task.downloadSpeed));

      setFormatedCompletedLen(format_size(task.completedLength));

      setFormatedTotalLen( format_size(task.totalLength));
      setETC(format_time((task.totalLength - task.completedLength)/task.downloadSpeed));

      //console.log(task);
    }
    return ()=>{ignore = true;};
  },[task]);

  function getTitle(){
    var dir = task.dir;
    var title = "Unknown";
    if (task.bittorrent && task.bittorrent.info && task.bittorrent.info.name)
      title = task.bittorrent.info.name;
    else if (task.files[0].path.replace(new RegExp("^"+dir.replace("\\", "[\\/]")+"/?"), "").split("/")[0])
      title = task.files[0].path.replace(new RegExp("^"+dir.replace("\\", "[\\/]")+"/?"), "").split("/")[0]
    else if (task.files.length && task.files[0].uris.length && task.files[0].uris[0].uri)
      title = task.files[0].uris[0].uri;

    if (task.files.length > 1) {
      var cnt = 0;
      for (var i=0; i<task.files.length; i++) {
        if (task.files[i].selected === "true")
          cnt += 1;
      }
      if (cnt > 1)
        title += " ("+cnt+ " files..)"
    }
    return title;
  }

  function calcProgress(){ 
    
    if (task.totalLength === 0)
      task.progress = 0;
    else
      task.progress = (task.completedLength * 1.0 / task.totalLength * 100).toFixed(2);
      task.etc = (task.totalLength - task.completedLength)/task.downloadSpeed;

    task.downloadSpeed = parseInt(task.downloadSpeed);
    task.uploadSpeed = parseInt(task.uploadSpeed);
    task.uploadLength = parseInt(task.uploadLength);
    task.completedLength = parseInt(task.completedLength);
    task.numSeeders = parseInt(task.numSeeders);
    task.connections = parseInt(task.connections);
    //task.totalLength = parseInt(task.totalLength);
    return task.progress;
  }

  function stat_icon() {
    const status_icon_map = {
      active: "icon-download-alt",
      waiting: "icon-time",
      paused: "icon-pause",
      error: "icon-remove",
      complete: "icon-ok",
      removed: "icon-trash",
    };
    
    return status_icon_map[task.status] || "";
    }

    function format_size(size) {
      var format_text = ["B", "KB", "MB", "GB", "TB", ];
      
        if (size === '') return '';
        size = parseInt(size);
        var i = 0;
        while (size >= 1024) {
          size /= 1024;
          i++;
        }
        if (size===0) {
          return "0 KB";
        } else {
          return size.toFixed(2)+" "+format_text[i];
        }
      
    }

    function format_time(time) {
      var time_interval = [60, 60, 24];
      var time_text = ["s", "m", "h"];
      
        if (time === Infinity) {
          return "INF";
        } else if (time === 0) {
          return "0s";
        }

        time = Math.floor(time);
        var i = 0;
        var result = "";
        while (time > 0 && i < 3) {
          result = time % time_interval[i] + time_text[i] + result;
          time = Math.floor(time/time_interval[i]);
          i++;
        }
        if (time > 0) {
          result = time + "d" + result;
        }
        return result;
      
    }
    
    function error_msg() {
      var error_code_map = {
        0: "",
        1: "unknown error occurred.",
        2: "time out occurred.",
        3: "resource was not found.",
        4: "resource was not found. See --max-file-not-found option.",
        5: "resource was not found. See --lowest-speed-limit option.",
        6: "network problem occurred.",
        7: "unfinished download.",
        8: "remote server did not support resume when resume was required to complete download.",
        9: "there was not enough disk space available.",
        10: "piece length was different from one in .aria2 control file. See --allow-piece-length-change option.",
        11: "aria2 was downloading same file at that moment.",
        12: "aria2 was downloading same info hash torrent at that moment.",
        13: "file already existed. See --allow-overwrite option.",
        14: "renaming file failed. See --auto-file-renaming option.",
        15: "aria2 could not open existing file.",
        16: "aria2 could not create new file or truncate existing file.",
        17: "I/O error occurred.",
        18: "aria2 could not create directory.",
        19: "name resolution failed.",
        20: "could not parse Metalink document.",
        21: "FTP command failed.",
        22: "HTTP response header was bad or unexpected.",
        23: "too many redirections occurred.",
        24: "HTTP authorization failed.",
        25: "aria2 could not parse bencoded file(usually .torrent file).",
        26: ".torrent file was corrupted or missing information that aria2 needed.",
        27: "Magnet URI was bad.",
        28: "bad/unrecognized option was given or unexpected option argument was given.",
        29: "the remote server was unable to handle the request due to a temporary overloading or maintenance.",
        30: "aria2 could not parse JSON-RPC request.",
      };
      
        return error_code_map[parseInt(task.errorcode)] || "";
    }

    
function InfoStop(props){
  const totalLength = props.totalLength ? props.totalLength : task.ftotalLength;
  const progress =  props.progress ? (props.progress + '%') : (jobPercent + '%');  
  const icon = props.icon ? props.icon : myIcon;
  const status = props.status;
  //console.log(props);

  return (
  <>
    <div className="task-info pull-left">
      <span className="task-status" rel="tooltip" title={status} >
        <i className={icon}></i></span>
      <span>{totalLength}</span>
      
    </div>
    <div className="progress progress-striped pull-right">
      <div className="bar" style={{width: progress}}>{progress}</div>
    </div>
  </>
  );
}

function InfoActive(props){
  const downloadSpeed = props.downloadSpeed ? props.downloadSpeed : formatedDLSpeed ;
  const progress = props.progress ? (props.progress + '%') : (jobPercent + '%');  
  const connections = props.connections;

  //console.log(props);

  return (
  <>
    <div className="progress progress-striped active">
        <div className="bar" style={{width: progress}}>{progress}</div>
    </div>
    <div className="progress-info">
        <span className="download-speed"><i className="icon-download"></i> {downloadSpeed+'/s'}</span>        
        <span className="seeders"><i className="icon-signal" rel="tooltip" title="Connections"></i> {connections}</span>
    </div>
  </>
  );
}

    //{task.uploadLength}<span>uploaded {format_size(task.uploadLength) }</span>{'/'+task.uploadLength}
    //<span className="seeders"><i className="icon-magnet" rel="tooltip" title="Seeders"></i> {task.numSeeders}</span>
    //<span className="upload-speed"><i className="icon-upload"></i> {format_size(task.uploadSpeed)+'/s'}</span>
  return (
    <li className="task" id={'task-gid-'+task.gid} data-status={task.status} data-gid={task.gid} data-infohash>
    <div className="left-area">
      <div className="task-name">
        <i className="select-box"></i>
        <span title={getTitle()}>{getTitle()}</span>
      </div>
      <div className="task-info">
        <span className="task-status" rel="tooltip" title={task.status+ ' '+ error_msg()}><i className={task.icon}></i></span>
              <span>{formatedCompletedLen +'/'+ formatedTotalLen}</span>              
              <span>剩余时间: {etc}</span>
      </div>
    </div>
    <div className="right-area">
      
      { props.type==='active' &&  <InfoActive downloadSpeed={formatedDLSpeed} progress={task.progress}  connections={task.connections} />}

      { props.type==='stop' &&  <InfoStop totallength={formatedTotalLen} progress={task.progress} icon={task.icon} status={task.status} />}
      
    </div>
  </li>
  )


}

export const Tasks = (props) =>{
   
    return (
      < >
     
     {props.tasks.length>0 && props.tasks.map(item => (
      <Task key={item.gid} item={item} type={props.type} />
    ))}
   
 
      </>
    );
  
}
export default Tasks;