package fi.oph.yki;


import ch.qos.logback.access.tomcat.LogbackValve;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class YkiConfiguration {

    private static final Logger logger = LoggerFactory.getLogger(YkiConfiguration.class);

    @Value("${logback.access:#{null}}")
    private String logbackAccess;

    @Bean
    @ConditionalOnProperty(name = "logback.access")
    public WebServerFactoryCustomizer containerCustomizer() {
        logger.info("Configuring logback access log from file {}", logbackAccess);
        return container -> {
            if (container instanceof TomcatServletWebServerFactory) {
                ((TomcatServletWebServerFactory) container).addContextCustomizers((TomcatContextCustomizer) context -> {
                    LogbackValve logbackValve = new LogbackValve();
                    logbackValve.setFilename(logbackAccess);
                    context.getPipeline().addValve(logbackValve);
                });
            }
        };

    }
}
