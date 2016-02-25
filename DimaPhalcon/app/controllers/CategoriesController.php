<?php

class CategoriesController extends ControllerBase
{

    public function getCategoriesTableAction(){
        $this->ajaxGetCheck();
        $categoriesList = '<tr>
                                    <th>Список категорий</th>
                                    <th>Артикул</th>
                                    <th class="editCategoriesTable"></th>
                                </tr>';
        $this->response->setContentType('application/json', 'UTF-8');
        $category = Categories::find();
        if ($category) {
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
        }
        $this->response->setJsonContent(['html' => $categoriesList, 'categoriesTableContent' => (object)$resObj]);

        return $this->response;
    }

    public function getCategoriesAction() {
        $this->ajaxGetCheck();
        $categories = Categories::find();
        $categoriesArr = [];
        $data = [];
        if ($categories) {
            $names = [];
            $articles = [];
            foreach ($categories as $cat) {
                array_push($categoriesArr, [
                    'id'      => $cat->getCategoryId(),
                    'name'    => $cat->getCategoryName(),
                    'article' => $cat->getArticle()
                ]);
                array_push($names, $cat->getCategoryName());
                array_push($articles, $cat->getArticle());
                $data[$cat->getCategoryId()] = ['name' => $cat->getCategoryName(), 'article' => $cat->getArticle()];
            }
            $resObj = [
                'names' => $names,
                'articles' => $articles,
                'data' => $data
            ];
        }
        $this->response->setJsonContent(['categories' => $categoriesArr, 'categoriesTableContent' => $resObj]);
        return $this->response;
    }

    public function addAction()
    {
        $this->ajaxPostCheck();
        $this->response->setContentType('application/json', 'UTF-8');
        $res = false;
        $msg = 'Такая Категория уже существует!';
        $article = $this->request->getPost('article');
        if (!Categories::findFirst("article = '" . $article . "'")) {
            $category = new Categories();
            $category->setCategoryName($this->request->getPost('categoryName'))
                     ->setArticle($article);
            if ($category->save()) {
                $res = true;
                $msg = 'Категория успешно добавлена';
            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

    public function getCategoriesListAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $categoriesList = false;
            $product = Products::findFirst($this->request->get('prId'));
            if ($product) {
                $productCategory = $product->getCategoryId();
                $categoriesList = $this->createCategoriesList($productCategory);
            }
            $this->response->setJsonContent($categoriesList);
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function editCategoryAction()
    {
        $this->ajaxPostCheck();
        $res = false;
        $msg = 'Такая Категория уже существует!';
        $catQ = Categories::findFirst($this->request->getPost('id'));
        if ($catQ && $catQ->setCategoryName($this->request->getPost('name'))->save()) {
            $res = true;
            $msg = 'Категория успешно отредактирована';
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

    public function removeCategoryAction()
    {
        $this->ajaxPostCheck();
        $res = false;
        $msg = 'Эта категория используется в продукте!';
        $categoryObj = Categories::findFirst($this->request->getPost('id'));
        if ($categoryObj != false) {
            try {
                if ($categoryObj->delete()) {
                    $res = true;
                    $msg = 'Категория успешно удалена';
                }
            } catch (\Exception $e) {

            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
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