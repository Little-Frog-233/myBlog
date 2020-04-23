import smtplib
from email.mime.text import MIMEText
from email.header import Header
from celery import Celery

cel = Celery('tasks', broker='redis://127.0.0.1:6379/5', backend='redis://127.0.0.1:6379/6')

@cel.task
def sendMail(usermail, token):
    '''
    '''
    sender = '13291327601@163.com'
    receivers = [usermail]
    mail_host="smtp.163.com"  #设置服务器
    mail_user="13291327601@163.com"    #用户名
    mail_pass="QOHELQFHGWCASPYK"   #口令 
    mail_msg = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <p>用户激活</p>
        <a href="{token}">点击以激活</a>
    </body>
    </html>
    """.format(token=token)
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = '13291327601@163.com'
    message['To'] =  usermail
    subject = '用户激活'
    message['Subject'] = Header(subject, 'utf-8')
    try:
        # smtpObj = smtplib.SMTP_SSL(mail_host, port=465)
        smtpObj = smtplib.SMTP() 
        smtpObj.connect(mail_host, 25)  
        smtpObj.login(mail_user,mail_pass)
        smtpObj.sendmail(sender, receivers, message.as_string())
        print("邮件发送成功")
        smtpObj.close()
    except smtplib.SMTPException as e:
        print(e)
        print("Error: 无法发送邮件")
        smtpObj.close()
    return