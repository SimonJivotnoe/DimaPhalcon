<?php

class CategoriesController extends ControllerBase
{

    public function getCategoriesTableAction(){
        if ( $this->request->isAjax() && $this->request->isGet()) {
            $category = Categories::find();
            if ($category == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($category->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $categoriesList = '<tr>
                                        <th>Список категорий</th>
                                        <th>Артикул</th>
                                        <th class="editCategoriesTable"></th>
                                    </tr>';
                $names = [];
                $articles = [];
                foreach ($category as $val) {
                    $categoriesList .= '<tr>
                                            <td><span class="categoryName">' . $val->getCategoryName() . '</span></td>
                                            <td>' . $val->getArticle() . '</td>
                                            <td class="editMetallTable">
                                                <span class="glyphicon glyphicon-pencil triggerCategoryPencil" aria-hidden="true" name="'. $val->getCategoryId() . '"></span>
                                                <span class="glyphicon glyphicon-remove triggerRemoveCategory" aria-hidden="true" name="'. $val->getCategoryId() . '"></span>
                                            </td>
                                        </tr>';
                    array_push($names, $val->getCategoryName());
                    array_push($articles, $val->getArticle());
                }
                $resObj = ['names' => $names, 'articles' => $articles];
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent(['html' => $categoriesList, 'categoriesTableContent' => (object)$resObj]);
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
            $article = $this->request->getPost('article');

            $this->response->setContentType('application/json', 'UTF-8');

            $checkArticle = Categories::findFirst("article = '" . $article . "'");
            if ($checkArticle) {
                $this->response->setJsonContent('already');
                return $this->response;
            }

            $category = new Categories();
            $category->setCategoryName($categoryName)
                     ->setArticle($article);
            if ($category->save() == false) {
                $this->response->setJsonContent(array('already'));
            } else {
                $this->response->setJsonContent(true);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function getCategoriesListAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $prId = $this->request->get('prId');
            $product = Products::findFirst($prId);
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $productCategory = $product->getCategoryId();
                $categoriesList = $this->createCategoriesList($productCategory);
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent($categoriesList);
                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function editCategoryAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('id');
            $name = $this->request->getPost('name');

            $this->response->setContentType('application/json', 'UTF-8');

            $catQ = Categories::findFirst($id);
            if ($catQ == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($catQ->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $catQ->setCategoryName($name);
                if ($catQ->save() == false) {
                    $this->response->setJsonContent('already');
                } else {
                    $this->response->setJsonContent(true);
                }

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function removeCategoryAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('id');
            $categoryObj = Categories::findFirst($id);
            $this->response->setContentType('application/json', 'UTF-8');
            if ($categoryObj != false) {
                try {
                    $categoryObj->delete();
                } catch (\Exception $e) {
                    $this->response->setJsonContent(false);
                    return $this->response;
                }
                $this->response->setJsonContent(true);
                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function createCategoriesList($productCatId=null, $isArticle = false){
        $category = Categories::find();
        $categoriesList = '';
        $article = '';
        $categoriesArr = array();
        if ($category == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($category->getMessages() as $message) {
                echo $message, "\n";
            }
        } else {
            foreach ($category as $val) {
                $categoriesArr[$val->getCategoryId()] = $val->getCategoryName();
                if ($isArticle) {
                    if ($val->getCategoryId() === $productCatId) {
                        $categoriesList = $val->getCategoryName();
                        $article = $val->getArticle();
                    }
                } else {
                    if ($val->getCategoryId() === $productCatId) {
                        $categoriesList .= '<option selected="selected" ';
                        $article = $val->getArticle();
                    } else {
                        $categoriesList .= '<option ';
                    }
                    $categoriesList .= 'name="'.$val->getCategoryId().'" article="' . $val->getArticle() . '">'.$val->getCategoryName().'</option>';
                }
            }
            return ['html' => $categoriesList, 'categoriesArr' => $categoriesArr, 'article' => $article];
        }
    }
}

