<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once 'access.inc.php';

$bodyPath = "/apps/job-postings";
$title = "Job Postings";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, false, 5);
$ui->setBodyClass('container-fluid');
$ui->AddCSS("public/main.css");
$ui->addManifest('public/js/manifest.json');
$ui->Send();
