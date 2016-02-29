<?php
use Phalcon\Mvc\Model,
    Phalcon\Validation,
    Phalcon\Mvc\Model\Validator\Uniqueness;

class Kim extends \Phalcon\Mvc\Model
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
    protected $kim_hard;

    /**
     *
     * @var string
     */
    protected $kim;
    
    /**
     *
     * @var string
     */
    protected $description;

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
     * Method to set the value of field kim_hard
     *
     * @param string $kim_hard
     * @return $this
     */
    public function setKimHard($kim_hard)
    {
        $this->kim_hard = $kim_hard;

        return $this;
    }

    /**
     * Method to set the value of field kim
     *
     * @param string $kim
     * @return $this
     */
    public function setKim($kim)
    {
        $this->kim = $kim;

        return $this;
    }
    
    /**
     * Method to set the value of field kim
     *
     * @param string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;

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
     * Returns the value of field kim_hard
     *
     * @return string
     */
    public function getKimHard()
    {
        return $this->kim_hard;
    }

    /**
     * Returns the value of field kim
     *
     * @return string
     */
    public function getKim()
    {
        return $this->kim;
    }
    
    /**
     * Returns the value of field kim
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Validations and business logic
     */
    public function validation()
    {
        $this->validate(
            new Uniqueness(
                array(
                    'field'  => 'kim_hard',
                    'message' => 'This name already exists'
                )));
        return $this->validationHasFailed() != true;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('kim_id', '\Products', 'kim', array('alias' => 'Products'));
    }

}
