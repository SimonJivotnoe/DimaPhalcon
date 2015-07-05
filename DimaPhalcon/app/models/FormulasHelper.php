<?php
use Phalcon\Mvc\Model,
    Phalcon\Validation,
    Phalcon\Mvc\Model\Validator\Email,
    Phalcon\Mvc\Model\Validator\Uniqueness;

class FormulasHelper extends Model
{

    /**
     *
     * @var integer
     */
    protected $id;

    /**
     *
     * @var string
     */
    protected $name;

    /**
     * Method to set the value of field id
     *
     * @param integer $id
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Method to set the value of field name
     *
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Returns the value of field id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Returns the value of field name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Validations and business logic
     */
    public function validation()
    {
        $this->validate(
            new Uniqueness(
                array(
                    "field"   => "name",
                    "message" => "This name already exists"
                )));
        return $this->validationHasFailed() != true;
    }

}
