<?php
use Phalcon\Mvc\Model,
    Phalcon\Validation,
    Phalcon\Mvc\Model\Validator\Uniqueness;
class Metalls extends Model
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
     *
     * @var string
     */
    protected $price;

    /**
     *
     * @var string
     */
    protected $mass;

    /**
     *
     * @var string
     */
    protected $out_price;

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
     * Method to set the value of field price
     *
     * @param string $price
     * @return $this
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Method to set the value of field mass
     *
     * @param string $mass
     * @return $this
     */
    public function setMass($mass)
    {
        $this->mass = $mass;

        return $this;
    }

    /**
     * Method to set the value of field out_price
     *
     * @param string $out_price
     * @return $this
     */
    public function setOutPrice($out_price)
    {
        $this->out_price = $out_price;

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
     * Returns the value of field price
     *
     * @return string
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Returns the value of field mass
     *
     * @return string
     */
    public function getMass()
    {
        return $this->mass;
    }

    /**
     * Returns the value of field out_price
     *
     * @return string
     */
    public function getOutPrice()
    {
        return $this->out_price;
    }

    /**
     * Validations and business logic
     */
    public function validation()
    {
        $this->validate(
            new Uniqueness(
                array(
                    'field'  => 'name',
                    'message' => 'This name already exists'
                )));
        return $this->validationHasFailed() != true;
    }
    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('id', '\Products', 'metall', array('alias' => 'Products'));
    }

}
