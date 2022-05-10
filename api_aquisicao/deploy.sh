#!/bin/sh

cd ..
MD5=$(find . -type f -exec md5sum {} \; | md5sum);
echo "$MD5";

i=1;
while [ "$i" -ne 0 ]
do
	NOVO_MD5=$(find . -type f -exec md5sum {} \; | md5sum);

	if [ "$MD5" != "$NOVO_MD5" ]
	then
		echo "Fazendo deploy :)"

		##### ZIPA TD Q PRECISA ####
		zip tcc_api_aquisicao.zip -r tcc_api_aquisicao/
	

        	#aws s3 rm s3://tcc-academia-lambda-functions --recursive --profile usr_tcc_lambda
	        aws s3 cp . s3://tcc-academia-lambda-functions/ --recursive --exclude="*" --include="*.zip" --profile usr_tcc_lambda
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=tcc_api_aquisicao.zip --function-name=tcc_cadastro_basico --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=tcc_api_aquisicao.zip --function-name=tcc_cadastro_celular --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=tcc_api_aquisicao.zip --function-name=tcc_cadastro_login --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=tcc_api_aquisicao.zip --function-name=tcc_cadastro_esqueci --profile=usr_tcc_lambda --region=us-east-1

		rm tcc_api_aquisicao.zip

		MD5="$NOVO_MD5";
	fi

	echo "Verificando novidades :)"
	sleep 0.5
done;

