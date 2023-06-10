import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Tasks} from './Aria2Tasks'
//import {YAAW } from '../js/yaaw'



export const Users = () => {
    const [activeTasks, setActiveTasks] = useState(null);
    const [waitingTasks, setWaitingTasks] = useState(null);
    const [stopTasks, setStopTasks] = useState(null);
    const serverEndpoint =  'http://192.168.1.69:6800/jsonrpc';

    function setupBody(method, params) {
        var dataObj = {
          jsonrpc: '2.0',
          method: 'aria2.'+method,
          id: 'qwer'
        }
        if(typeof(params) !== 'undefined') {
          dataObj.params = params;
        }
        return JSON.stringify(dataObj);
      }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'React Hooks POST Request Example' })
      };

    function pullData()
    {
        requestOptions.body = setupBody('tellActive',[])
        fetch(serverEndpoint,requestOptions)
        .then(res =>res.json())
        .then(data =>{
            //console.log(data);
            setActiveTasks(data);
        });

        requestOptions.body = setupBody('tellWaiting',[0,1000])
        fetch(serverEndpoint,requestOptions)
        .then(res =>res.json())
        .then(data =>{
            //console.log(data);
            setWaitingTasks(data);
        });

        requestOptions.body = setupBody('tellStopped',[0,1000])
        fetch(serverEndpoint,requestOptions)
        .then(res =>res.json())
        .then(data =>{
            //console.log(data);
            setStopTasks(data);
        });
        console.log('aria rpc synced ')
    }

    useEffect(()=>{
        //pullData();

        let timefired = setInterval(pullData,15000);
        
        return ()=>{clearInterval(timefired)}

    },[]);
    


    return (
        <>
        <meta charSet="utf-8" />
        <title>aria2 web客户端</title>
        <meta name="author" content="Binux" />
        <link href="css/main.css" rel="stylesheet" />
        <link href="css/bootstrap.min.css" rel="stylesheet" />
        <link href="css/bootstrap-responsive.min.css" rel="stylesheet" />
        {/*[if lt IE 9]>
      
          <![endif]*/}
        <div className="container">
          <header className="main-head page-header">
            <h1>aria2 web客户端</h1>
            <span id="offline-cached" />
            <div id="global-info" className="pull-right">
              <div id="global-version" />
              <div id="global-speed" />
            </div>
          </header>
          <div className="clearfix" id="main-control">
            <div id="main-alert" className="hide">
              <div id="main-alert-inline" className="alert">
                <link href="###"  className="close"/>
                 
                <span className="alert-msg">Loading</span>
              </div>
            </div>
            <div className="pull-left">
              <div className="btn-group btn-inline" id="select-btn">
                <button
                  id="select-all-btn"
                  className="btn"
                  rel="tooltip"
                  title="选择所有"
                >
                  <i className="select-box" />
                </button>
                <a className="btn dropdown-toggle" data-toggle="dropdown" href="#">
                  <span className="caret" />
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="###" onClick="{YAAW.tasks.selectActive()}">
                      选择活动的任务
                    </a>
                  </li>
                  <li>
                    <a href="###" onClick="{YAAW.tasks.selectWaiting()}">
                      选择等待的任务
                    </a>
                  </li>
                  <li>
                    <a href="###" onClick="{YAAW.tasks.selectPaused()}">
                      选择暂停的任务
                    </a>
                  </li>
                  <li>
                    <a href="###" onClick="{YAAW.tasks.selectStoped()}">
                      选择停止的任务
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pull-left" id="not-selected-grp">
              <div className="btn-group btn-inline">
                <a
                  className="btn"
                  id="add-task-btn"
                  data-toggle="modal"
                  href="#add-task-modal"
                  rel="tooltip"
                  title="添加任务"
                >
                  <i className="icon-plus" /> 添加
                </a>
              </div>
              <div className="btn-group btn-inline" id="do-all-btn">
                <a
                  href="###"
                  onClick="{ARIA2.unpause_all()}"
                  className="btn"
                  id="unpause-all"
                  rel="tooltip"
                  title="全部开始"
                >
                  <i className="icon-forward" />
                </a>
                <a
                  href="###"
                  onClick="ARIA2.pause_all();"
                  className="btn"
                  id="pause-all"
                  rel="tooltip"
                  title="全部暂停"
                >
                  <i className="icon-stop" />
                </a>
                <a
                  href="###"
                  onClick="ARIA2.purge_download_result();"
                  className="btn"
                  id="pure-all"
                  rel="tooltip"
                  title="移除完成的任务"
                >
                  <i className="icon-trash" />
                </a>
              </div>
            </div>
            <div className="pull-left hide" id="selected-grp">
              <div className="btn-group btn-inline">
                <a
                  href="###"
                  onClick="YAAW.tasks.unpause();YAAW.tasks.unSelectAll();"
                  className="btn"
                  rel="tooltip"
                  title="开始"
                >
                  <i className="icon-play" />
                </a>
                <a
                  href="###"
                  onClick="YAAW.tasks.pause();YAAW.tasks.unSelectAll();"
                  className="btn"
                  rel="tooltip"
                  title="暂停"
                >
                  <i className="icon-pause" />
                </a>
                <a
                  href="###"
                  onClick="YAAW.tasks.remove();YAAW.tasks.unSelectAll();"
                  className="btn"
                  rel="tooltip"
                  title="移除"
                >
                  <i className="icon-remove" />
                </a>
              </div>
              {/*<button class="btn pull-left" id="info-btn" rel="tooltip" title="Task Info">*/}
              {/*<i class="icon-info-sign"></i> Info*/}
              {/*</button>*/}
            </div>
            <div className="pull-right" id="other-grp">
              <div className="btn-group btn-inline">
                <a
                  href="#"
                  className="btn"
                  id="refresh-btn"
                  rel="tooltip"
                  title="刷新"
                >
                  <i className="icon-refresh" /> 刷新
                </a>
                <a
                  className="btn"
                  id="setting-btn"
                  data-toggle="modal"
                  href="#setting-modal"
                  rel="tooltip"
                  title="设置"
                >
                  <i className="icon-wrench" />
                </a>
              </div>
            </div>
          </div>
          <section id="active-tasks">
            <div className="section-header">
              <i className="icon-chevron-down" />
              <b>活动任务</b>
              
            </div>
            <ul className="tasks-table" id="active-tasks-table">
            { activeTasks && activeTasks.result.length > 0 && <Tasks tasks={activeTasks.result} type='active'/>}

            {
                activeTasks && activeTasks.result.length === 0 &&
                <li>
                <div class="empty-tasks">
                <strong>没有活动的任务</strong>
                </div>
                </li>
            }
              <li>
                <div className="empty-tasks">
                  <strong>暂停/停止的任务</strong>
                </div>
              </li>
            </ul>
          </section>
          <section id="other-tasks">
            <div className="section-header">
              <i className="icon-chevron-down" />
              <b>其它任务</b>
              
             
            </div>
            <ul id="waiting-tasks-table" className="tasks-table">
            { waitingTasks && waitingTasks.result.length > 0  && <Tasks tasks={waitingTasks.result} type='wait'/>}

            { 
              stopTasks && stopTasks.result.length === 0 && 
              <li>
                <div className="empty-tasks">
                  <strong>没有任务</strong>
                </div>
              </li>
            }
            </ul>
            <ul id="stoped-tasks-table" className="tasks-table">
            { stopTasks && stopTasks.result.length > 0 && <Tasks tasks={stopTasks.result} type='stop'/>}
            </ul>
          </section>
        </div>
        <ul id="task-contextmenu" className="dropdown-menu">
          <li className="task-restart">
            <a href="###" onClick="YAAW.contextmenu.restart();">
              重新开始
            </a>
          </li>
          <li className="task-start">
            <a href="###" onClick="YAAW.contextmenu.unpause();">
              开始
            </a>
          </li>
          <li>
            <a href="###" onClick="YAAW.contextmenu.pause();">
              暂停
            </a>
          </li>
          <li>
            <a href="###" onClick="YAAW.contextmenu.remove();">
              移除
            </a>
          </li>
          <li className="task-move divider" />
          <li className="task-move">
            <a href="###" onClick="YAAW.contextmenu.movetop();">
              移到顶端
            </a>
          </li>
          <li className="task-move">
            <a href="###" onClick="YAAW.contextmenu.moveup();">
              上移
            </a>
          </li>
          <li className="task-move">
            <a href="###" onClick="YAAW.contextmenu.movedown();">
              下移
            </a>
          </li>
          <li className="task-move">
            <a href="###" onClick="YAAW.contextmenu.moveend();">
              移到底端
            </a>
          </li>
        </ul>
        <section className="modal hide fade" id="add-task-modal">
          <div className="modal-header">
            <button className="close" data-dismiss="modal">
              ×
            </button>
            <h3>添加任务</h3>
          </div>
          <div className="modal-body">
            <div id="add-task-alert" className="alert alert-error hide">
              <a href="###" onClick="$('#add-task-alert').hide();" className="close">
                ×
              </a>
              <strong>错误:</strong> <span className="alert-msg" />
            </div>
            <form
              id="add-task-uri"
              onSubmit="YAAW.add_task.submit(this);return false;"
            >
              <div className="input-append">
                <input
                  type="text"
                  name="uri"
                  id="uri-input"
                  className="input-clear"
                  placeholder="HTTP, FTP or Magnet"
                />
                <span>
                  <input type="file" id="torrent-up-input" />
                  <a
                    id="torrent-up-btn"
                    className="btn"
                    rel="tooltip"
                    title="File API is Not Supported."
                  >
                    上传BT种子
                  </a>
                </span>
              </div>
              <textarea
                id="uri-textarea"
                rows={5}
                className="input-clear hide"
                placeholder="HTTP, FTP or Magnet"
                defaultValue={""}
              />
            </form>
            <div id="uri-more">
              <span className="or-and">∨∨∨∨∨∨</span>
              <span className="or-and" style={{ display: "none" }}>
                ∧∧∧∧∧∧
              </span>
            </div>
            <div id="add-task-option-wrap" />
          </div>
          <div className="modal-footer">
            <a
              href="###"
              onClick="$('#add-task-uri').submit();"
              id="add-task-submit"
              className="btn btn-primary"
            >
              添加
            </a>
            <a
              href="###"
              onClick="YAAW.add_task.clean();"
              className="btn"
              data-dismiss="modal"
            >
              取消
            </a>
          </div>
        </section>
        <section className="modal hide fade" id="setting-modal">
          <div className="modal-header">
            <button className="close" data-dismiss="modal">
              ×
            </button>
            <h2>设置</h2>
          </div>
          <div className="modal-body">
            <form
              id="setting-form"
              className="form-horizontal"
              onSubmit="YAAW.setting.submit();return false;"
            >
              <fieldset>
                <div className="control-group">
                  <label className="control-label" htmlFor="rpc-path">
                    JSON-RPC 链接
                  </label>
                  <div className="controls">
                    <div className="input-append btn-group rpc-path-wrap">
                      <input
                        type="text"
                        className="input-xlarge pull-left"
                        id="rpc-path"
                      />
                      <a className="add-on btn dropdown-toggle" href="#" disabled="">
                        <b className="caret" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="control-group">
                  <label className="control-label">自动刷新</label>
                  <div className="controls">
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="refresh_interval"
                        defaultValue={5000}
                      />{" "}
                      每5秒
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="refresh_interval"
                        defaultValue={10000}
                        defaultChecked=""
                      />{" "}
                      每10秒
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="refresh_interval"
                        defaultValue={30000}
                      />{" "}
                      每30秒
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="refresh_interval"
                        defaultValue={300000}
                      />{" "}
                      每5分钟
                    </label>
                    <label className="radio inline">
                      <input type="radio" name="refresh_interval" defaultValue={0} />{" "}
                      关闭
                    </label>
                  </div>
                </div>
              </fieldset>
            </form>
            <div id="aria2-gsetting"></div>
          </div>
          <div className="modal-footer">
            <div id="copyright">
              · Copyright <a href="https://github.com/binux/yaaw">Binux</a>
            </div>
            <a
              href="###"
              onClick="$('#setting-form').submit();"
              className="btn btn-success"
            >
              保存
            </a>
            <a href="#" className="btn" data-dismiss="modal">
              取消
            </a>
          </div>
        </section>
        {/* vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8: */}

        
      </>
      
    );
}