package fi.oph.yki;

import fi.oph.yki.model.LogEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class YkiLogController {

    private static final Logger logger = LoggerFactory.getLogger(YkiLogController.class);

    private static long LOG_MSG_LIMIT = 102400L;

    @PostMapping(value=  "/log")
    public ResponseEntity<String> log(@RequestBody LogEntry logEntry) {
        long size = logEntry.getMessage().length() + logEntry.getStack().length() + logEntry.getPathname().length();
        if (size < LOG_MSG_LIMIT) {
            logger.error("Error in route: {} \n message: {} \n stacktrace:\n {}", logEntry.getPathname(), logEntry.getMessage(), logEntry.getStack());
        } else {
            logger.warn("Error log entry too large: {} characters", size);
        }
        return new ResponseEntity<>("{\"success\":true}", HttpStatus.OK);
    }
}