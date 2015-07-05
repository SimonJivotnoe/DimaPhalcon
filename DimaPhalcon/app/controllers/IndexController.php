<?php

class IndexController extends ControllerBase
{
    const VALUE = 5;
    public function indexAction()
    {
        /*if ( $this->request->isAjax() && $this->request->isPost())
        $this->request->getPost('group1');
        $this->response->setJsonContent(array('array' => ''));
        return $this->response;
        $value = 'sadsadsad';
        $this->view->setVar('tabs', $value);
        $array = array(1, 2, 3);
        $this->view->setVar('array', $array);
        $category = Categories::find();//select * from categories;
        $this->view->setVar('category', $category);
        $array = array();
        foreach ($category as $val) {
            $val->getName();
            $array[] = array('id' => $val->getId());
        }*/
        if (!empty($_POST)) {
           /* if ( $this->request->isAjax() && $this->request->isPost()) {
                $filename = $this->request->getPost('filename');
                $content = $this->request->getPost('content');
                $objContent = new ContentWorker();
                $res = $objContent->rewriteContentAction($filename, $content);
                $this->response->setJsonContent(array($res));
                return $this->response;
            }*/
        }

        $value = file_get_contents('../public/files/tabs.volt');
        $this->view->setVar('tabs', $value);
    }

    public function getTabsAction(){
        if ( $this->request->isAjax() ) {
            $this->response->setJsonContent(array('ok'));
            return $this->response;
        }
    }
}

