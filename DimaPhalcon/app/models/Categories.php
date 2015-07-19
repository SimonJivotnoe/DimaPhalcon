<?php
use Phalcon\Mvc\Model,
    Phalcon\Validation,
    Phalcon\Mvc\Model\Validator\Uniqueness;

class Categories extends Model
{

    /**
     *
     * @var integer
     */
    protected $category_id;

    /**
     *
     * @var string
     */
    protected $category_name;

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
     * Method to set the value of field category_name
     *
     * @param string $category_name
     * @return $this
     */
    public function setCategoryName($category_name)
    {
        $this->category_name = $category_name;

        return $this;
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
     * Returns the value of field category_name
     *
     * @return string
     */
    public function getCategoryName()
    {
        return $this->category_name;
    }

    /**
     * Validations and business logic
     */
    public function validation()
    {
        $this->validate(
            new Uniqueness(
                array(
                    "field"   => "category_name",
                    "message" => "This name already exists"
                )));
        return $this->validationHasFailed() != true;
    }
    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('category_id', '\Formulas', 'category_id', array('alias' => 'Formulas'));
        $this->hasMany('category_id', '\Products', 'category_id', array('alias' => 'Products'));
    }

}
