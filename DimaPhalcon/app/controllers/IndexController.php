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
        $this->assets
             ->collection('styleHead')
             ->addCss('css/main.css')
             ->addCss('css/libs/jqtree.css')
             ->addCss('css/libs/split-pane.css')
             ->addCss('css/libs/pretty-split-pane.css')
             ->addCss('css/libs/jquery-ui.min.css', false, false)
             ->addCss('css/libs/hover-min.css', false, false)
             ->setTargetPath('css/productionHead.css')
             ->setTargetUri('css/productionHead.css')
             ->join(true)
             ->addFilter(new \Phalcon\Assets\Filters\Cssmin());
        $this->assets
             ->collection('jsFooter')
             ->addJs('js/Dima.js')
             ->addJs('js/main.js')
             ->addJs('js/libs/split-pane.min.js', false, false)
             ->addJs('js/libs/underscore-min.js', false, false)
             ->setTargetPath('js/production.js')
             ->setTargetUri('js/production.js')
             ->join(true)
             ->addFilter(new \Phalcon\Assets\Filters\Jsmin());
        $left = file_get_contents('../public/files/tabs.volt');
        //$right = file_get_contents('../public/files/tabsRight.volt');
        $right = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', file_get_contents('../public/files/tabsRight.volt'));
        $this->view->setVars(array(
            'tabs' => $left,
            'tabsRight' => $right
        ));
    }
    function file_get_contents_utf8($fn) {
        $content = file_get_contents($fn);
        return mb_convert_encoding($content, 'UTF-8',
            mb_detect_encoding($content, 'UTF-8, ISO-8859-5, windows-1251', true));
    }
}

