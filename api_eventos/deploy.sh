#!/bin/sh

NAME=tcc_api_eventos

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
		zip $NAME.zip -r $NAME
	

        #aws s3 rm s3://tcc-academia-lambda-functions --recursive --profile usr_tcc_lambda	    
		aws s3 cp . s3://tcc-academia-lambda-functions/ --recursive --exclude="*" --include="*.zip" --profile usr_tcc_lambda
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_criar_local --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_listar --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_criar --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_listar_local --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_criar_agendamento --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_listar_agendamento --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_criar_cartao --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_listar_cartao --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_deletar_cartao --profile=usr_tcc_lambda --region=us-east-1
		aws lambda update-function-code --s3-bucket=tcc-academia-lambda-functions --s3-key=$NAME.zip --function-name=tcc_eventos_validar_agendamento --profile=usr_tcc_lambda --region=us-east-1

		rm $NAME.zip

		MD5="$NOVO_MD5";
	fi

	echo "Verificando novidades :)"
	sleep 0.5
done;

