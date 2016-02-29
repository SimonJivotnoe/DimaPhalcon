<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    protected function ajaxGetCheck() {
        if ( !$this->request->isAjax() || !$this->request->isGet()) {
            $this->response->redirect('');
        }
        $this->response->setContentType('application/json', 'UTF-8');
    } 
    
    protected function ajaxPostCheck() {
        if ( !$this->request->isAjax() || !$this->request->isPost()) {
            $this->response->redirect('');
        }
        $this->response->setContentType('application/json', 'UTF-8');
    }
    
    protected function ajaxDeleteCheck() {
        if ( !$this->request->isAjax() || !$this->request->isDelete()) {
            $this->response->redirect('');
        }
        $this->response->setContentType('application/json', 'UTF-8');
    } 
}
