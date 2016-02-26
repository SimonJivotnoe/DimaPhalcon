<?php

class IndexController extends ControllerBase
{
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
        $sub = new Substitution();
        /*$this->assets
             ->collection('styleHead')
             ->addCss('css/main.css', false, false)
             ->addCss('css/libs/jqtree.css', false, false)
             ->addCss('css/libs/split-pane.css', false, false)
             ->addCss('css/libs/pretty-split-pane.css', false, false)
             ->addCss('css/libs/jquery-ui.min.css', false, false)
             ->addCss('css/libs/hover-min.css', false, false)
             ->addCss('css/bootstrap/bootstrap.min.css', false, false)
             ->addCss('css/libs/animate.css', false, false)
             ->addCss('css/libs/notifcenter.css', false, false)
             ->addCss('js/jquery/colorpicker/dist/css/bootstrap-colorpicker.min.css', false, false)
             ->join(false);*/
             /*->setTargetPath('css/productionHead.css')
             ->setTargetUri('css/productionHead.css')
             ->join(false)
             ->addFilter(new \Phalcon\Assets\Filters\Cssmin());*/
        $this->assets
             ->collection('jsFooter')
             ->addJs('js/Dima.js', false, false)
             ->addJs('js/libs/split-pane.min.js', false, false)
             ->addJs('js/libs/underscore-min.js', false, false)
             ->join(false);
             //->addFilter(new \Phalcon\Assets\Filters\Jsmin());
        //$left = file_get_contents('../public/files/tabs.volt');
        $this->view->setVars(array(
            //'tabs' => $left,
            'templates' => file_get_contents('../public/files/templates.html')
        ));
    }
}

