import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  FTP_HOST: Joi.string().required(),
  FTP_PORT: Joi.number()
    .default(21),
  FTP_USERNAME: Joi.string().required(),
  FTP_PASSWORD: Joi.string().required(),
  FTP_USER_PROFILE_PIC_PATH: Joi.string().required(),
  PROFILE_IMAGE_DIRECTORY_URL: Joi.string().required(),
  FTP_CATEGORY_PIC_PATH: Joi.string().required(),
  CATEGORY_IMAGE_DIRECTORY_URL: Joi.string().required(),
  FTP_PRODUCT_CATALOGUE_COVER_IMAGE_PATH: Joi.string().required(),
  PRODUCT_CATALOGUE_COVER_IMAGE_URL: Joi.string().required(),
  FTP_PRODUCT_IMAGE_PATH: Joi.string().required(),
  PRODUCT_IMAGE_URL: Joi.string().required()
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  ftp: {
    host: envVars.FTP_HOST,
    port: envVars.FTP_PORT,
    user: envVars.FTP_USERNAME,
    password: envVars.FTP_PASSWORD
  },
  ftpPath: {
    userProfileImage: envVars.FTP_USER_PROFILE_PIC_PATH,
    categoryImagePath: envVars.FTP_CATEGORY_PIC_PATH,
    productCatalogueCoverImagePath: envVars.FTP_PRODUCT_CATALOGUE_COVER_IMAGE_PATH,
    productImagePath: envVars.FTP_PRODUCT_IMAGE_PATH,
  },
  profileImageDirectoryUrl : envVars.PROFILE_IMAGE_DIRECTORY_URL,
  categoryImageDirectoryUrl: envVars.CATEGORY_IMAGE_DIRECTORY_URL,
  productCatalogueCoverImageUrl: envVars.PRODUCT_CATALOGUE_COVER_IMAGE_URL,
  productImageUrl: envVars.PRODUCT_IMAGE_URL
};

export default config;
