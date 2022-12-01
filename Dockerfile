FROM openjdk:11
EXPOSE 8080
ADD target/firstcicdusingdockerpublish.jar firstcicdusingdockerpublish.jar
ENTRYPOINT ["java","-jar","/firstcicdusingdockerpublish.jar"]