<?php
use Phalcon\Mvc\Model,
    Phalcon\Validation,
    Phalcon\Mvc\Model\Validator\Uniqueness;

class Kim extends Model
{

    /**
     *
     * @var integer
     */
    protected $kim_id;

    /**
     *
     * @var string
     */
    protected $kim;

    /**
     *
     * @var double
     */
    protected $kim_price;

    /**
     * Method to set the value of field kim_id
     *
     * @param integer $kim_id
     * @return $this
     */
    public function setKimId($kim_id)
    {
        $this->kim_id = $kim_id;

        return $this;
    }

    /**
     * Method to set the value of field kim
     *
     * @param double $kim
     * @return $this
     */
    public function setKim($kim)
    {
        $this->kim = $kim;

        return $this;
    }

    /**
     * Method to set the value of field kim_price
     *
     * @param double $kim_price
     * @return $this
     */
    public function setKimPrice($kim_price)
    {
        $this->kim_price = $kim_price;

        return $this;
    }

    /**
     * Returns the value of field kim_id
     *
     * @return integer
     */
    public function getKimId()
    {
        return $this->kim_id;
    }

    /**
     * Returns the value of field kim
     *
     * @return double
     */
    public function getKim()
    {
        return $this->kim;
    }

    /**
     * Returns the value of field kim_price
     *
     * @return double
     */
    public function getKimPrice()
    {
        return $this->kim_price;
    }

    /**
     * Validations and business logic
     */
    public function validation()
    {
        $this->validate(
            new Uniqueness(
                array(
                    "field"   => "kim",
                    "message" => "This name already exists"
                )));
        return $this->validationHasFailed() != true;
    }
}
