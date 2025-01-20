php vendor/bin/doctrine orm:convert-mapping --namespace="" --force --from-database yml ./api/config/yaml
php vendor/bin/doctrine orm:generate-entities --generate-annotations=false --update-entities=true --generate-methods=false ./api/src
composer update
