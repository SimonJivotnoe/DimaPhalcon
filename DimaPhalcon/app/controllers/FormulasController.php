<?php

class FormulasController extends ControllerBase
{

    public function getFormulasHelperAction() {
        $this->ajaxGetCheck();
        $formulasHelper= [];
        $formulasHelperObj = FormulasHelper::find();
        foreach ( $formulasHelperObj as $val) {
            array_push($formulasHelper, ['id' => $val->getId(), 'name' => $val->getName()]);
        }
        $this->response->setJsonContent(['success' => true, 'formulasHelper' => $formulasHelper]);

        return $this->response;
    }

    public function addBtnToFormulasHelperAction(){
        $this->ajaxPostCheck();
        $success = 0;
        $msg = 'Ошибка при добавлении шаблона формулы';
        $newFl = $this->request->getPost('newFl');
        $fh = new FormulasHelper();
        $fh->setName($newFl);
        if ($fh->save()) {
            $success = 1;
            $data = ['id' => $fh->getId()];
        }

        $this->response->setJsonContent(['success' => $success, 'msg' => $msg, 'data' => $data]);

        return $this->response;
    }

    public function removeBtnFromFormulasHelperAction($id){
        $this->ajaxDeleteCheck();
        $res = false;
        $msg = 'Ошибка при удалении шаблона формулы';
        $fh = FormulasHelper::findFirst($id);
        if ($fh != false) {
            try {
                if ($fh->delete()) {
                    $res = true;
                    $msg = true;
                }
            } catch (\Exception $e) {

            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

}

