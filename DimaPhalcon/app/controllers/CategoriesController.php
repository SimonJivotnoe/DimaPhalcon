<?php

class CategoriesController extends ControllerBase
{

    public function getCategoriesListAction(){
        if ( $this->request->isAjax() && $this->request->isGet()) {
            $category = Categories::find();
            if ($category == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($category->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $categoriesList = array();
                foreach ($category as $val) {
                    $categoriesList[ ] = $val->getCategoryName();
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent($categoriesList);
                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function addAction()
    {
        if ( $this->request->isAjax() && $this->request->isPost()) {
            $categoryName = $this->request->getPost('categoryName');
            $category = new Categories();
            $category->setCategoryName($categoryName);
            if ($category->save() == false) {
                $this->response->setJsonContent(array('already'));
            } else {
                $this->response->setJsonContent(array('ok'));
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function updateAction()
    {
        $category = Categories::findFirst(1);
        $category->setCategoryName('утка2');
        if ($category->save() == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($category->getMessages() as $message) {
                echo $message, "\n";
            }
        } else {
            echo "Отлично, новый робот был успешно сохранен!";
        }
    }
}

