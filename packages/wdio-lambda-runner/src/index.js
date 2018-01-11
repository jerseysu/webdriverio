import fs from 'fs'
import tmp from 'tmp'
import path from 'path'
import shell from 'shelljs'
import EventEmitter from 'events'
import omit from 'lodash.omit'

import logger from 'wdio-logger'
import { DEFAULT_CONFIG } from './constants'

const log = logger('wdio-lambda-runner')
const OMITTED_ENVIRONMENT_KEYS = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SECRET_KEY', 'AWS_ACCESS_KEY']

export default class AWSLambdaRunner extends EventEmitter {
    constructor (config, capabilities, specs) {
        super()

        const { AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID } = process.env
        if (!AWS_ACCESS_KEY || !AWS_ACCESS_KEY_ID) {
            throw new Error('Please provide AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_BUCKET in your environment')
        }

        this.instances = []
        this.config = config
        this.capabilities = capabilities
        this.specs = specs
        this.nodeModulesDir = `${process.cwd()}/node_modules/**`

        /**
         * generate temp dir for AWS service
         */
        this.serviceDir = tmp.dirSync({
            prefix: '.wdio-runner-service',
            dir: process.cwd(),
            mode: '0750'
        })
        log.info('Generating temporary AWS Lamdba service directory at %s', this.serviceDir.name)

        /**
         * create config
         */
        const runnerConfig = Object.assign(DEFAULT_CONFIG, {
            nodeVersion: process.version.slice(1),
            environment: config.runnerConfig.environment,
            package: {
                include: [this.nodeModulesDir, ...this.specs],
                exclude: []
            }
        })

        /**
         * copy over files
         */
        shell.cp(path.resolve(__dirname, '..', 'config', 'serverless.yml'), path.resolve(this.serviceDir.name, 'serverless.yml'))
        shell.cp(path.resolve(__dirname, 'handler.js'), path.resolve(this.serviceDir.name, 'handler.js'))
        fs.writeFileSync(path.resolve(this.serviceDir.name, 'runner-config.json'), JSON.stringify(runnerConfig, null, 4))
    }

    /**
     * initialise runner environment
     * create lambda service and deploy it to AWS
     */
    async initialise () {
        /**
         * create temporary service dir
         */

        /**
         * copy over files
         */
        // shell.cp(this.nodeModulesDir, path.resolve(serviceDir, 'packages'))
        // this.specs.forEach(
        //     (specFile) => shell.cp(specFile, path.resolve(serviceDir, 'specs', path.basename(specFile)))
        // )


    }

    /**
     * kill all instances that were started
     */
    kill () {
    }

    run (options) {
        console.log(options)
        console.log(this.nodeModulesDir)
        console.log(process.version);
    }
}