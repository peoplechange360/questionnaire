<?php

use vendors\symfony\src\Symfony\Bridge\Twig\Form\TwigRenderer;
use vendors\symfony\src\Symfony\Bridge\Twig\Form\TwigRendererEngine;
use vendors\symfony\src\Symfony\Bridge\Twig\Extension\FormExtension;

class Project_Twig_Extension extends Twig_Extension
{

    public function getName()
    {
        return 'project';
    }

    public function getFunctions() {
        return array(
            'form_start' => new Twig_Function_Method($this, 'form_starts', array('is_safe' => array('html'))),
            'form_end' => new Twig_Function_Method($this, 'form_ends', array('is_safe' => array('html')))
        );
    }

    public function getFilters() {
        return array(
            'trans' => new Twig_Filter_Method($this, 'trans'),
            'debug' => new Twig_Filter_Method($this, 'debug')
        );
    }

    public function form_starts($form, $options)
    {
        return '<form action="" id="'.$options['attr']['id'].'">';
    }

    public function form_ends()
    {
        return '</form>';
    }

    public function trans()
    {
        return '';
    }

    public function debug($a)
    {
        return var_dump($a);
    }

    public function form_errors()
    {
        return '';
    }

    public function form_rest()
    {
        return '';
    }

}
