# Changelog

## v1.5.2
* peer-dependency ra-core can have any version

## v1.5.0
* Add renameFields options, allowing to rename **`id`** field name before it receives  **`_id`**
* **`_id`** field name is renamed **`id`** when available (no longer duplicated)  

## v1.4.0
* Add user options to data provider, in order to specify **`_id`** field name (duplicated as  **`id`** for react-admin) for some/all resources  

## v1.3.1
* removed babel-jest from dependencies
* Fix **`_id`** to **`id`** duplication 

## v1.3.0
* Added CHANGELOG
* **`_id`** (moleculer's id name) automatically duplicated as **`id`** (React-Admin's id name) in *GetCreate*, *GetList* and *GetManyReference* results
* Fix total value in *GetList* and *GetManyReference*
* Fix GetCreate response

## v1.2.1
* badge
* fix const issue

## v1.2.0
* re-organized npm package 

## v1.1.1
* Fix some issues

## v1.1.0
* Fix some issues

## v1.0.0
* Initial release
