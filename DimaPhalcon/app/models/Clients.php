<?php

class Clients extends \Phalcon\Mvc\Model
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
    protected $fio;

    /**
     *
     * @var string
     */
    protected $appeal;

    /**
     *
     * @var string
     */
    protected $company_name;

    /**
     *
     * @var string
     */
    protected $adress;

    /**
     *
     * @var string
     */
    protected $accaunt;

    /**
     *
     * @var string
     */
    protected $zip;

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
     * Method to set the value of field fio
     *
     * @param string $fio
     * @return $this
     */
    public function setFio($fio)
    {
        $this->fio = $fio;

        return $this;
    }

    /**
     * Method to set the value of field appeal
     *
     * @param string $appeal
     * @return $this
     */
    public function setAppeal($appeal)
    {
        $this->appeal = $appeal;

        return $this;
    }

    /**
     * Method to set the value of field company_name
     *
     * @param string $company_name
     * @return $this
     */
    public function setCompanyName($company_name)
    {
        $this->company_name = $company_name;

        return $this;
    }

    /**
     * Method to set the value of field adress
     *
     * @param string $adress
     * @return $this
     */
    public function setAdress($adress)
    {
        $this->adress = $adress;

        return $this;
    }

    /**
     * Method to set the value of field accaunt
     *
     * @param string $accaunt
     * @return $this
     */
    public function setAccaunt($accaunt)
    {
        $this->accaunt = $accaunt;

        return $this;
    }

    /**
     * Method to set the value of field zip
     *
     * @param string $zip
     * @return $this
     */
    public function setZip($zip)
    {
        $this->zip = $zip;

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
     * Returns the value of field fio
     *
     * @return string
     */
    public function getFio()
    {
        return $this->fio;
    }

    /**
     * Returns the value of field appeal
     *
     * @return string
     */
    public function getAppeal()
    {
        return $this->appeal;
    }

    /**
     * Returns the value of field company_name
     *
     * @return string
     */
    public function getCompanyName()
    {
        return $this->company_name;
    }

    /**
     * Returns the value of field adress
     *
     * @return string
     */
    public function getAdress()
    {
        return $this->adress;
    }

    /**
     * Returns the value of field accaunt
     *
     * @return string
     */
    public function getAccaunt()
    {
        return $this->accaunt;
    }

    /**
     * Returns the value of field zip
     *
     * @return string
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('id', '\Projects', 'client', array('alias' => 'Projects'));
    }

}
