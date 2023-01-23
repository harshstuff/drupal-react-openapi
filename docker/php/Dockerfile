#
# NOTE: THIS DOCKERFILE IS GENERATED VIA "apply-templates.sh"
#
# PLEASE DO NOT EDIT IT DIRECTLY.
#

# from https://www.drupal.org/docs/system-requirements/php-requirements
FROM php:8.0-fpm-alpine3.14

# install the PHP extensions we need
RUN set -eux; \
	\
	apk add --no-cache --virtual .build-deps \
	coreutils \
	freetype-dev \
	libjpeg-turbo-dev \
	libpng-dev \
	libzip-dev \
	# postgresql-dev is needed for https://bugs.alpinelinux.org/issues/3642
	postgresql-dev \
	; \
	\
	docker-php-ext-configure gd \
	--with-freetype \
	--with-jpeg=/usr/include \
	; \
	\
	docker-php-ext-install -j "$(nproc)" \
	gd \
	opcache \
	pdo_mysql \
	pdo_pgsql \
	zip \
	; \
	\
	runDeps="$( \
	scanelf --needed --nobanner --format '%n#p' --recursive /usr/local \
	| tr ',' '\n' \
	| sort -u \
	| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-network --virtual .drupal-phpexts-rundeps $runDeps; \
	apk del --no-network .build-deps

# set recommended PHP.ini settings
# see https://secure.php.net/manual/en/opcache.installation.php
RUN { \
	echo 'opcache.memory_consumption=128'; \
	echo 'opcache.interned_strings_buffer=8'; \
	echo 'opcache.max_accelerated_files=4000'; \
	echo 'opcache.revalidate_freq=60'; \
	echo 'opcache.fast_shutdown=1'; \
	} > /usr/local/etc/php/conf.d/opcache-recommended.ini

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/

# https://www.drupal.org/node/3060/release
# ENV DRUPAL_VERSION 9.2.4

WORKDIR /opt/drupal

# custom thq code
RUN set -eux; \
	apk add ssmtp git mysql-client patch; \
	apk add mysql-client; \
	apk --no-cache add pcre-dev ${PHPIZE_DEPS}; \
	pecl install xdebug && docker-php-ext-enable xdebug; \
	apk del pcre-dev ${PHPIZE_DEPS}; \
	mkdir -p web/sites web/modules web/themes; \
	# chown -R www-data:www-data web/sites web/modules web/themes; \
	rmdir /var/www/html; \
	ln -sf /opt/drupal/web /var/www/html; 

# adding vendor/bin to path so drush can run
ENV PATH=${PATH}:/opt/drupal/vendor/bin


