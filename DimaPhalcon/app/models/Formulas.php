<?php

class Formulas extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $formula_id;

    /**
     *
     * @var string
     */
    protected $formula;

    /**
     *
     * @var integer
     */
    protected $category_id;

    /**
     * Method to set the value of field formula_id
     *
     * @param integer $formula_id
     * @return $this
     */
    public function setFormulaId($formula_id)
    {
        $this->formula_id = $formula_id;

        return $this;
    }

    /**
     * Method to set the value of field formula
     *
     * @param string $formula
     * @return $this
     */
    public function setFormula($formula)
    {
        $this->formula = $formula;

        return $this;
    }

    /**
     * Method to set the value of field category_id
     *
     * @param integer $category_id
     * @return $this
     */
    public function setCategoryId($category_id)
    {
        $this->category_id = $category_id;

        return $this;
    }

    /**
     * Returns the value of field formula_id
     *
     * @return integer
     */
    public function getFormulaId()
    {
        return $this->formula_id;
    }

    /**
     * Returns the value of field formula
     *
     * @return string
     */
    public function getFormula()
    {
        return $this->formula;
    }

    /**
     * Returns the value of field category_id
     *
     * @return integer
     */
    public function getCategoryId()
    {
        return $this->category_id;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->belongsTo('category_id', '\Categories', 'category_id', array('alias' => 'Categories'));
    }

}
