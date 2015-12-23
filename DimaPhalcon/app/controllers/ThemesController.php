<?php

use Phalcon\Db\RawValue;

class ThemesController extends \Phalcon\Mvc\Controller
{

    public function addThemeAction()
    {
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

}

