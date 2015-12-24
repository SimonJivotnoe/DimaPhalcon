<?php

use Phalcon\Db\RawValue;

class ThemesController extends \Phalcon\Mvc\Controller
{

    public function addThemeAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $name = $this->request->getPost('name');
            $this->response->setContentType('application/json', 'UTF-8');
            $themeObj = Themes::findFirst(array("name = '$name'"));
            if ($themeObj == false) {
                $themeObj = new Themes();
                $themeObj
                    ->setName($name)
                    ->setCss(new RawValue('default'))
                    ->setActive(new RawValue('default'))
                    ->save();
                $this->response->setJsonContent(true);

                return $this->response;
            }
            $this->response->setJsonContent(false);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function getThemesListAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $themesObj = Themes::find();
            $list = '<option value="default">Default</option>';
            $themesArr = ['0' => [], '1' => []];
            $this->response->setContentType('application/json', 'UTF-8');
            if (count($themesObj)) {
                foreach ($themesObj as $val) {
                    $themesArr[$val->getActive()][$val->getName()] = $val->getCss();
                    $option = '<option value="' . $val->getName() . '"';
                    if ('1' === $val->getActive()) {
                        $option .= ' selected';
                    }
                    $option .= '>' . $val->getName() . '</option>';
                    $list .= $option;
                }
            }
            $this->response->setJsonContent(['html' => $list, 'list' => $themesArr]);

            return $this->response;
        } else {
            $this->response->redirect();
        }
    }

    public function applyThemesAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $theme = $this->request->getPost('theme');
            $obj = Themes::find(array("active=1"));
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(['css' => false]);
            if (count($obj)) {
                foreach ($obj as $val) {
                    $val->setActive('0')->save();
                }
            }
            if ('default' !== $theme) {
                $objTheme = Themes::findFirst(array("name='$theme'"));
                if (count($objTheme)) {
                    $objTheme->setActive('1')->save();
                }
                $this->response->setJsonContent(['css' => $objTheme->getCss()]);

            }
            return $this->response;
            
        } else {
            $this->response->redirect('');
        }
    }
    
    public function addThemeCssAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $theme = $this->request->getPost('theme');
            $css = $this->request->getPost('css');
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(false);
            $objTheme = Themes::findFirst(array("name='$theme'"));
            if (count($objTheme)) {
                $objTheme->setCss(json_encode($css));
                if ($objTheme->save()) {
                    $this->response->setJsonContent(true);
                }
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
}

